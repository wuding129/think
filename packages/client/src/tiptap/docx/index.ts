import axios from 'axios';
import { HeadingLevel } from 'docx';
import { defaultMarks, defaultNodes, DocxSerializer, writeDocx } from 'prosemirror-docx';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { Title } from 'tiptap/core/extensions/title';

const nodeSerializer = {
  ...defaultNodes,
  [Title.name](state, node) {
    state.renderInline(node);
    state.closeBlock(node, { heading: HeadingLevel.HEADING_1 });
  },
  [DocumentChildren.name](state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },
};

const docxSerializer = new DocxSerializer(nodeSerializer, defaultMarks);

async function getImageBuffer(src: string) {
  const image = await axios.get(src, {
    responseType: 'arraybuffer',
  });
  return Buffer.from(image.data);
}

export const prosemirrorToDocx = async (view: EditorView, state: EditorState): Promise<Blob> => {
  const dom = view.dom.closest('.ProseMirror');
  const imageBufferCache = new Map();
  const images = Array.from(await dom.querySelectorAll('img')) as HTMLImageElement[];

  await Promise.all(
    images.map(async (img) => {
      const buffer = await getImageBuffer(img.src);
      imageBufferCache.set(img.src, buffer);
    })
  );

  const wordDocument = docxSerializer.serialize(state.doc, {
    getImageBuffer(src) {
      return imageBufferCache.get(src);
    },
  });

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    await writeDocx(wordDocument, (buffer) => {
      imageBufferCache.clear();
      resolve(new Blob([buffer]));
    });
  });
};
