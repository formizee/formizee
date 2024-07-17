import {waitlist} from '@/routes/waitlist';
import {describe, expect, it} from 'vitest';

describe('Waitlist /join integration', () => {
  it('Should return 200', async () => {
    const response = await waitlist.request('/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'example@formizee.com'
      })
    });

    expect(await response.json()).toBe("You're on the Waitlist!");
    expect(response.status).toBe(201);
  });

  it('Should return 409 when the user is already on the waitlist', async () => {
    const response = await waitlist.request('/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'example@formizee.com'
      })
    });

    const expectedResponse = {
      name: 'Be patient...',
      description:
        "You're already on the list! We'll keep you updated on Formizee launch."
    };
    expect(await response.json()).toStrictEqual(expectedResponse);
    expect(response.status).toBe(409);
  });
});
