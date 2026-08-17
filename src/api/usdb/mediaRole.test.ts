import { describe, expect, test } from "bun:test";
import { detectMediaRole } from "./mediaRole.ts";
import {
  parseVideoMetaResources,
  parseYoutubeLinks,
  selectDownloadSources,
} from "./youtube.ts";

const comment = (date: string, body: string): string =>
  `<tr class="list_tr2"><td>${date} | <a href="?link=profil&id=1">user</a></td></tr><tr class="list_tr1"><td>${body}</td></tr>`;

const iframe = (id: string): string =>
  `<br><center><br><iframe class="embed" width="432" height="240" src="https://www.youtube.com/embed/${id}"></iframe></center><br>`;

const SONG_31412_HTML = `
<table border="0" width="500">
<tr class="list_head"><td>Comments by users (two cents)</td></tr>
<tr class="list_tr1"><td></td></tr>
${comment("17.08.26 - 02:41", `AUDIO:<br />\r\n${iframe("hPMjlzz0PCM")}`)}
${comment("17.08.26 - 02:40", `VIDEO:<br />\r\n${iframe("WAgqNq6NuUU")}`)}
${comment("17.12.25 - 21:23", iframe("hPMjlzz0PCM"))}
</table>
`;

describe("detectMediaRole", () => {
  test("recognizes English labels with colon", () => {
    expect(detectMediaRole("AUDIO:")).toBe("audio");
    expect(detectMediaRole("VIDEO:")).toBe("video");
    expect(detectMediaRole("audio")).toBe("audio");
    expect(detectMediaRole("Video")).toBe("video");
  });

  test("ignores case, accents and punctuation", () => {
    expect(detectMediaRole("ÁUDIO:")).toBe("audio");
    expect(detectMediaRole("VÍDEO:")).toBe("video");
    expect(detectMediaRole("[Audio]")).toBe("audio");
    expect(detectMediaRole("(vídeo)")).toBe("video");
    expect(detectMediaRole("audio -")).toBe("audio");
  });

  test("recognizes other languages", () => {
    expect(detectMediaRole("SOM:")).toBe("audio");
    expect(detectMediaRole("MÚSICA:")).toBe("audio");
    expect(detectMediaRole("CLIPE:")).toBe("video");
    expect(detectMediaRole("SONIDO:")).toBe("audio");
    expect(detectMediaRole("PELÍCULA:")).toBe("video");
    expect(detectMediaRole("TON:")).toBe("audio");
    expect(detectMediaRole("MUZYKA:")).toBe("audio");
    expect(detectMediaRole("WIDEO:")).toBe("video");
    expect(detectMediaRole("АУДИО:")).toBe("audio");
    expect(detectMediaRole("ВИДЕО:")).toBe("video");
    expect(detectMediaRole("音频:")).toBe("audio");
    expect(detectMediaRole("视频:")).toBe("video");
    expect(detectMediaRole("オーディオ:")).toBe("audio");
    expect(detectMediaRole("ビデオ:")).toBe("video");
  });

  test("prefers compound phrases over overlapping words", () => {
    expect(detectMediaRole("official video")).toBe("video");
    expect(detectMediaRole("music video")).toBe("video");
    expect(detectMediaRole("official audio")).toBe("audio");
    expect(detectMediaRole("lyric video")).toBe("video");
    expect(detectMediaRole("audio clip")).toBe("audio");
  });

  test("treats joined audio+video labels as both", () => {
    expect(detectMediaRole("VIDEO AND AUDIO:")).toBe("both");
    expect(detectMediaRole("AUDIO/VIDEO")).toBe("both");
    expect(detectMediaRole("vídeo + áudio")).toBe("both");
  });

  test("last heading wins when labels are on separate lines", () => {
    expect(detectMediaRole("AUDIO:\nVIDEO:")).toBe("video");
    expect(detectMediaRole("VIDEO:\nAUDIO:")).toBe("audio");
  });

  test("does not treat a long sentence mentioning audio as a label", () => {
    expect(
      detectMediaRole(
        "I think the audio quality of this performance is better than the previous upload on the channel",
      ),
    ).toBe("unknown");
  });
});

describe("parseYoutubeLinks", () => {
  test("splits AUDIO and VIDEO sources on USDB song 31412", () => {
    const links = parseYoutubeLinks(SONG_31412_HTML);
    expect(links.map((item) => ({ link: item.link, role: item.role }))).toEqual(
      [
        { link: "hPMjlzz0PCM", role: "audio" },
        { link: "WAgqNq6NuUU", role: "video" },
        { link: "hPMjlzz0PCM", role: "unknown" },
      ],
    );

    const sources = selectDownloadSources(links);
    expect(sources.separateAudio).toBe(true);
    expect(sources.videoLinks[0]).toBe("WAgqNq6NuUU");
    expect(sources.audioLinks[0]).toBe("hPMjlzz0PCM");
  });

  test("assigns roles when both embeds are in the same comment", () => {
    const html = comment(
      "01.01.24 - 12:00",
      `VIDEO:<br />${iframe("aaaaaaaaaaa")}<br />AUDIO:<br />${iframe("bbbbbbbbbbb")}`,
    );
    const links = parseYoutubeLinks(html);
    expect(links).toEqual([
      expect.objectContaining({ link: "aaaaaaaaaaa", role: "video" }),
      expect.objectContaining({ link: "bbbbbbbbbbb", role: "audio" }),
    ]);
  });

  test("keeps unlabeled comments as a single shared source", () => {
    const html = comment("01.01.24 - 12:00", iframe("ccccccccccc"));
    const links = parseYoutubeLinks(html);
    const sources = selectDownloadSources(links);
    expect(links[0]?.role).toBe("unknown");
    expect(sources.separateAudio).toBe(false);
    expect(sources.videoLinks[0]).toBe("ccccccccccc");
    expect(sources.audioLinks[0]).toBe("ccccccccccc");
  });

  test("uses the AUDIO youtube as video when it is the only source", () => {
    const html = comment(
      "01.01.24 - 12:00",
      `AUDIO:<br />${iframe("ddddddddddd")}`,
    );
    const sources = selectDownloadSources(parseYoutubeLinks(html));
    expect(sources.separateAudio).toBe(false);
    expect(sources.videoLinks[0]).toBe("ddddddddddd");
    expect(sources.audioLinks[0]).toBe("ddddddddddd");
  });

  test("uses the VIDEO youtube as audio when it is the only source", () => {
    const html = comment(
      "01.01.24 - 12:00",
      `VIDEO:<br />${iframe("eeeeeeeeeee")}`,
    );
    const sources = selectDownloadSources(parseYoutubeLinks(html));
    expect(sources.separateAudio).toBe(false);
    expect(sources.videoLinks[0]).toBe("eeeeeeeeeee");
    expect(sources.audioLinks[0]).toBe("eeeeeeeeeee");
  });

  test("treats an unlabeled youtube as video when only AUDIO is labeled", () => {
    const html = [
      comment("01.01.24 - 12:00", `AUDIO:<br />${iframe("ffffffffff1")}`),
      comment("01.01.24 - 11:00", iframe("ffffffffff2")),
    ].join("");
    const sources = selectDownloadSources(parseYoutubeLinks(html));
    expect(sources.separateAudio).toBe(true);
    expect(sources.audioLinks[0]).toBe("ffffffffff1");
    expect(sources.videoLinks[0]).toBe("ffffffffff2");
  });

  test("treats an unlabeled youtube as audio when only VIDEO is labeled", () => {
    const html = [
      comment("01.01.24 - 12:00", `VIDEO:<br />${iframe("gggggggggg1")}`),
      comment("01.01.24 - 11:00", iframe("gggggggggg2")),
    ].join("");
    const sources = selectDownloadSources(parseYoutubeLinks(html));
    expect(sources.separateAudio).toBe(true);
    expect(sources.videoLinks[0]).toBe("gggggggggg1");
    expect(sources.audioLinks[0]).toBe("gggggggggg2");
  });

  test("ignores an unlabeled duplicate of the only AUDIO source", () => {
    const html = [
      comment("01.01.24 - 12:00", `AUDIO:<br />${iframe("hhhhhhhhhhh")}`),
      comment("01.01.24 - 11:00", iframe("hhhhhhhhhhh")),
    ].join("");
    const sources = selectDownloadSources(parseYoutubeLinks(html));
    expect(sources.separateAudio).toBe(false);
    expect(sources.videoLinks[0]).toBe("hhhhhhhhhhh");
    expect(sources.audioLinks[0]).toBe("hhhhhhhhhhh");
  });
});

describe("parseVideoMetaResources", () => {
  test("reads a= and v= from the #VIDEO header", () => {
    expect(parseVideoMetaResources("v=WAgqNq6NuUU,a=hPMjlzz0PCM")).toEqual({
      video: "WAgqNq6NuUU",
      audio: "hPMjlzz0PCM",
    });
  });

  test("meta tags take priority over comment labels", () => {
    const links = parseYoutubeLinks(SONG_31412_HTML);
    const sources = selectDownloadSources(links, {
      video: "vvvvvvvvvvv",
      audio: "aaaaaaaaaaa",
    });
    expect(sources.videoLinks[0]).toBe("vvvvvvvvvvv");
    expect(sources.audioLinks[0]).toBe("aaaaaaaaaaa");
    expect(sources.separateAudio).toBe(true);
  });
});
