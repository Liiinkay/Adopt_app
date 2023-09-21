const posts = [
    {
      id: 't0',
      user: {
        id: 'u1',
        username: 'VadimNotJustDev',
        name: 'Vadim',
        image:
          'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.png',
      },
      createdAt: '2020-08-27T12:00:00.000Z',
      content: 'Se busca dueño para un perro',
      description: 'Esta es una descripción',
      image:
        'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg',
      multimedia: [
        'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg',
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png',
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png',
      ],
      numberOfComments: 123,
      numberOfRetweets: 11,
      numberOfLikes: 10,
      type: 'adopt'
    },
    {
      id: '111111111',
      createdAt: '2023-04-28T08:30:00.000Z',
      user: {
        id: '123456789',
        name: 'Jeff B',
        username: 'bezos',
        image:
          'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg',
      },
      content: 'Just had a great workout at the gym! 💪 #fitness #healthylifestyle',
      description: 'Esta es una descripción',
      multimedia: [
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png',
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png',
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png',
      ],
      numberOfComments: 2,
      numberOfRetweets: 5,
      numberOfLikes: 25,
      impressions: 500,
      type: 'adopt'
    },
    {
      id: '222222222',
      createdAt: '2023-04-27T19:45:00.000Z',
      user: {
        id: '987654321',
        name: 'Zuck',
        username: 'zuck',
        image:
          'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg',
      },
      content: 'Had an amazing surf session this morning',
      description: 'Esta es una descripción',
      image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/8.jpg',
      multimedia: [
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png',
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png',
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png',
      ],
      numberOfComments: 10,
      numberOfRetweets: 20,
      numberOfLikes: 100,
      impressions: 1000,
      type: 'search'
    }
  ];

export default posts;
