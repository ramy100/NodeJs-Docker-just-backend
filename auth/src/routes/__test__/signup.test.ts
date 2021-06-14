import authHeplers from '../../test/helpers/auth';

it('returns a 201 on successful signup', async () => {
  await authHeplers.signUp('r@r.com', '123456', 201);
});

it('returns a 400 on bad email signup', async () => {
  await authHeplers.signUp('ramy', '123456', 400);
});

it('returns a 400 on bad password signup', async () => {
  await authHeplers.signUp('r@r.com', '123', 400);
});

it('returns a 400 on dublicate email signup', async () => {
  await authHeplers.signUp('r@r.com', '123456', 201);
  await authHeplers.signUp('r@r.com', '123456', 400);
});
