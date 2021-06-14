import authHeplers from '../../test/helpers/auth';

it('returns a 201 on successful signIn', async () => {
  await authHeplers.signUp('r@r.com', '123456', 201);
  await authHeplers.signIn('r@r.com', '123456', 201);
});

it('returns a 400 on wrong email signIn', async () => {
  await authHeplers.signIn('r@r.com', '123456', 400);
});

it('returns a 400 on wrong password signIn', async () => {
  await authHeplers.signUp('r@r.com', '123456', 201);
  await authHeplers.signIn('r@r.com', '1234561', 400);
});

it('returns a 400 on bad password signIn', async () => {
  await authHeplers.signUp('r@r.com', '123456', 201);
  await authHeplers.signIn('r@r.com', '123', 400);
});

it('returns a 400 on bad email signIn', async () => {
  await authHeplers.signUp('r@r.com', '123456', 201);
  await authHeplers.signIn('r@r', '123456', 400);
});
