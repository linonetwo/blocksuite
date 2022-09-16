import { expect, type Page } from '@playwright/test';
import type { SerializedStore } from '../../packages/framework/src';

const defaultPlayground = 'http://localhost:5173/';
export const emptyInput = 'input';
export const richTextBox = '.ql-editor';

export async function getStore(page: Page): Promise<SerializedStore> {
  // @ts-ignore
  return page.evaluate(() => window.store.doc.toJSON());
}

export async function assertText(page: Page, text: string) {
  const actual = await page.innerText('.ql-editor');
  expect(actual).toBe(text);
}

export async function assertTextBlocks(page: Page, texts: string[]) {
  const actual = await page.locator('.ql-editor').allInnerTexts();
  expect(actual).toEqual(texts);
}

export async function assertStore(page: Page, expected: SerializedStore) {
  const actual = await getStore(page);
  expect(actual).toEqual(expected);
}

export async function enterPlaygroundRoom(page: Page, room?: string) {
  if (!room) {
    room = `virgo-${Math.random().toFixed(8).substring(2)}`;
  }
  await page.goto(`${defaultPlayground}?room=${room}`);
  return room;
}

export async function undoByClick(page: Page) {
  await page.click('text=Undo');
}

export async function redoByClick(page: Page) {
  await page.click('text=Redo');
}
