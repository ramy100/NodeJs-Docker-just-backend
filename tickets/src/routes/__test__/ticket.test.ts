import { Ticket } from '../../models/ticket';
import { getNewValidUser } from '../../test/helpers/auth';
import { createTicket } from '../../test/helpers/ticket';

it('implements optimistic concurrency control', async () => {
  const user = getNewValidUser('r@r.com');
  const ticket = await createTicket({ userId: user.id });
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }
  throw new Error('should not reach this');
});
it('increments version after updating', async () => {
  const user = getNewValidUser('r@r.com');
  const ticket = await createTicket({ userId: user.id });
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
