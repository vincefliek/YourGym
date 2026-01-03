import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';

import { Button } from './view';
import userEventBuilder from '@testing-library/user-event';

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

    await act(() => userEvent.click(btn));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('fires onClick on iOS when pointerdown + pointerup without movement', async () => {
    jest.doMock('../../utils/isIOS', () => ({ isIOS: () => true }));
    const userEvent = userEventBuilder.setup();

    const handler = jest.fn();
    render(<Button onClick={handler}>Press</Button>);

    const btn = await screen.findByRole('button');

    await act(() => userEvent.click(btn));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick on iOS when pointermove (scroll) occurs between down/up', async () => {
    jest.doMock('../../utils/isIOS', () => ({ isIOS: () => true }));

    const handler = jest.fn();
    render(<Button onClick={handler}>Press</Button>);
    const btn = await screen.findByRole('button');

    act(() => {
      fireEvent.pointerDown(btn);
      fireEvent.pointerMove(btn);
      fireEvent.pointerUp(btn);
    });

    expect(handler).not.toHaveBeenCalled();
  });
});
