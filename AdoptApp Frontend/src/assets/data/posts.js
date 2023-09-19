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
      content: 'Can you please check if the Subscribe button on Youtube works?',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/thumbnail.png',
      numberOfComments: 123,
      numberOfRetweets: 11,
      numberOfLikes: 10,
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
      content:
        'Just had a great workout at the gym! 💪 #fitness #healthylifestyle',
      numberOfComments: 2,
      numberOfRetweets: 5,
      numberOfLikes: 25,
      impressions: 500,
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
      image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/8.jpg',
      numberOfComments: 10,
      numberOfRetweets: 20,
      numberOfLikes: 100,
      impressions: 1000,
    }
  ];

export default posts;
