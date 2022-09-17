import type { Quill, RangeStatic } from 'quill';
import type { Store } from '../../';
import { ITextBlockModel } from '../../../../blocks/src/text-block/index';

interface BindingContext {
  collapsed: boolean;
  empty: boolean;
  offset: number;
  prefix: string;
  suffix: string;
  format: Record<string, unknown>;
}

type KeyboardBindings = Record<
  string,
  {
    key: string | number;
    handler: KeyboardBindingHandler;
    prefix?: RegExp;
    suffix?: RegExp;
    shortKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    ctrlKey?: boolean;
  }
>;

interface KeyboardEventThis {
  quill: Quill;
  options: {
    bindings: KeyboardBindings;
  };
}

type KeyboardBindingHandler = (
  this: KeyboardEventThis,
  range: RangeStatic,
  context: BindingContext
) => void;

export const createkeyboardBindings = (store: Store) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientID = store.doc.clientID as any;

  function undo() {
    store.undo();
  }

  function redo() {
    store.redo();
  }

  function hardEnter(this: KeyboardEventThis) {
    const isAtBlockEnd =
      this.quill.getLength() - 1 === this.quill.getSelection()?.index;
    if (isAtBlockEnd) {
      const blockProps: ITextBlockModel = {
        flavour: 'text',
        id: store.createId(),
        text: '',
      };
      // make adding text block by enter a standalone operation
      store.captureSync();
      store.addBlock(blockProps);
    }
  }

  function softEnter(this: KeyboardEventThis) {
    const index = this.quill.getSelection()?.index || 0;
    this.quill.insertText(index, '\n', clientID);
  }

  const keyboardBindings: KeyboardBindings = {
    undo: {
      key: 'z',
      shortKey: true,
      handler: undo,
    },
    hardEnter: {
      key: 'enter',
      handler: hardEnter,
    },
    softEnter: {
      key: 'enter',
      shiftKey: true,
      handler: softEnter,
    },
    redo: {
      key: 'z',
      shiftKey: true,
      shortKey: true,
      handler: redo,
    },
  };

  return keyboardBindings;
};