export const ValidateProps = {
  user: {
    username: { type: 'string', minLength: 0, maxLength: 20 },
    name: { type: 'string', minLength: 0, maxLength: 50 },
    password: { type: 'string', minLength: 8 },
    email: { type: 'string', minLength: 1 },
    bio: { type: 'string', minLength: 0, maxLength: 160 },
  },
  post: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
  comment: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
  submission: {
    title: { type: 'string', minLength: 1, maxLength: 50 },
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
  company: {
    name: { type: 'string', minLength: 1, maxLength: 50 },
    email: { type: 'string', minLength: 1 },
  },
  attendance: {
    status: { type: 'string', minLength: 1, maxLength: 10 },
    overtimeNotes: { type: 'string', minLength: 0 },
    businessTrip: { type: 'string', minLength: 0 },
  },
};
