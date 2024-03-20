type ButtonStyle = {
  [provider: string]: { backgroundColor: string; color: string };
};
const buttonStyles: ButtonStyle = {
  azure: {
    backgroundColor: '#008AD7',
    color: 'white',
  },
  bitbucket: {
    backgroundColor: '#205081',
    color: 'white',
  },
  facebook: {
    backgroundColor: '#4267B2',
    color: 'white',
  },
  github: {
    backgroundColor: '#333',
    color: 'white',
  },
  gitlab: {
    backgroundColor: '#FC6D27',
    color: 'white',
  },
  google: {
    backgroundColor: '#ce4430',
    color: 'white',
  },
  twitter: {
    backgroundColor: '#1DA1F2',
    color: 'white',
  },
  apple: {
    backgroundColor: '#000',
    color: 'white',
  },
  discord: {
    backgroundColor: '#404fec',
    color: 'white',
  },
  twitch: {
    backgroundColor: '#9146ff',
    color: 'white',
  },
};

export default buttonStyles;
