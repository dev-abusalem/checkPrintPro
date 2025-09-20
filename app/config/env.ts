// make client url if development use / otherwise use 

export const clientUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://check-print-pro.vercel.app';