import { render, screen } from '@testing-library/react';
import userEventBuilder from '@testing-library/user-event';

import { Button } from './view';

describe('Button (iOS click fix)', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('calls onClick for non-iOS (regular button) when clicked', async () => {
    jest.doMock('../../utils/isIOS', () => ({ isIOS: () => false }));
    const userEvent = userEventBuilder.setup();

    const handler = jest.fn();
    render(<Button onClick={handler}>Press</Button>);

    const btn = await screen.findByRole('button');

    await userEvent.pointer([
      { keys: '[TouchA>]', target: btn },
      { keys: '[/TouchA]' },
    ]);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('fires onClick on iOS when pointerdown + pointerup without movement', async () => {
    jest.doMock('../../utils/isIOS', () => ({ isIOS: () => true }));
    const userEvent = userEventBuilder.setup();

    const handler = jest.fn();
    render(<Button onClick={handler}>Press</Button>);

    const btn = await screen.findByRole('button');

    await userEvent.pointer([
      { keys: '[TouchA>]', target: btn },
      { keys: '[/TouchA]' },
    ]);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick on iOS when pointermove (scroll) occurs between down/up', async () => {
    jest.doMock('../../utils/isIOS', () => ({ isIOS: () => true }));
    const userEvent = userEventBuilder.setup();

    const handler = jest.fn();
    render(<Button onClick={handler}>Press</Button>);

    const btn = await screen.findByRole('button');

    await userEvent.pointer([
      // touch the screen at element1
      // The ">" suffix indicates a press and hold (PointerDown)
      { keys: '[TouchA>]', target: btn },
      // move the touch pointer on the screen
      // "coords" simulates a physical movement
      { pointerName: 'TouchA', target: btn, coords: { x: 10, y: 100 } },
      // release the touch pointer at the last position
      // The "/" prefix indicates a release (PointerUp)
      { keys: '[/TouchA]' },
    ]);

    expect(handler).not.toHaveBeenCalled();
  });
});
