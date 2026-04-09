import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ObservationDeck } from './ObservationDeck';

describe('ObservationDeck', () => {
  it('triggers a "signal loss" glitch effect when the stream is interrupted (channel switched)', () => {
    vi.useFakeTimers();
    
    // Mock AudioContext to prevent errors during test
    class MockAudioContext {
      currentTime = 0;
      destination = {};

      createOscillator() {
        return {
          type: '',
          frequency: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        };
      }

      createGain() {
        return {
          gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        };
      }
    }

    window.AudioContext = MockAudioContext as any;

    render(
      <MemoryRouter>
        <ObservationDeck />
      </MemoryRouter>
    );

    // Initially, the glitch screen should not be present
    expect(screen.queryByTestId('glitch-screen')).not.toBeInTheDocument();

    // Find the button for Channel 2
    const channel2Button = screen.getByText('CH2');

    // Click to switch channel (interrupt stream)
    act(() => {
      fireEvent.click(channel2Button);
    });

    // The glitch screen should now be visible
    expect(screen.getByTestId('glitch-screen')).toBeInTheDocument();
    expect(screen.getByText('SIGNAL LOST')).toBeInTheDocument();

    // Advance timers by 800ms (the duration of the glitch effect)
    act(() => {
      vi.advanceTimersByTime(800);
    });

    // The glitch screen should be gone
    expect(screen.queryByTestId('glitch-screen')).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
