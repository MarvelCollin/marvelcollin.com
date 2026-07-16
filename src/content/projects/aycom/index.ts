import type { Project } from '../../../types';

const project: Project = {
  slug: 'aycom',
  num: '09',
  name: 'aycom',
  year: '2024',
  role: 'Full-stack',
  stack: 'Svelte · Go · gRPC · Redis · RabbitMQ',
  client: 'Academic',
  tag: 'academic',
  desc: 'a Twitter clone built on microservices architecture',
  brief: 'Full microservices social media platform.',
  body: [
    'aycom is a Twitter clone built as a fully decomposed microservices system. Each service (auth, posts, feed, notifications) runs independently and communicates via gRPC and RabbitMQ.',
    'Frontend in Svelte, backend services in Go with PostgreSQL and Redis. Includes a TensorFlow-based content categorization service. Fully containerized with Docker.',
    'JWT authentication, real-time feeds, and message queuing for async operations.',
  ],
  result: 'Full microservices platform',
  tone: 'plum',
  stills: ['Feed view', 'Architecture diagram', 'Service mesh'],
  github: 'https://github.com/MarvelCollin/aycom',
};

export default project;
