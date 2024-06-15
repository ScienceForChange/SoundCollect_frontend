import {gql} from 'apollo-angular';

export const fragments = {
  user: {
    username: gql`fragment username on User {
      id
      username
      name
    }`,
    user: gql`fragment user on User {
      id
      username
      name
      surname
      lastname
      gender
      mobile
      email
      birthdate
      enabled
      locale
      groups{
        collection{
          ...group
        }
      }
    }`
  },
  group: {
    group: gql`fragment group on Group {
      id
      name
      active
      roles
    }`
  },
  unlockedItems: {
    unlockedItems: gql`fragment unlockItem on UnlockItem {
      _id
      id
      date
      item {
        id
        title
        description
        code
        _id
      }
    }`
  },
  patient: {
    patient: gql`fragment patient on Patient {
      id
      username
      name
      surname
      lastname
      gender
      mobile
      email
      birthdate
      enabled
      locale
      stepsCount
      adherentia
      steps
      flags
      hasProgramInit
      hasConsultEnabled
      specialists {
        collection {
          ...specialists
        }
      }
      unlockedItems {
        collection{
          ...unlockItem
        }
      }
      groups{
        collection{
          ...group
        }
      }
    }`
  },
  program: {
    program: gql`fragment program on Program {
      id
      title
      description
      days
      plans {
        collection {
          id
          dayOrder
          date
          programItem {
            ...item
          }
        }
      }
    }`,
    item: gql`fragment item on ProgramItem {
      id
      title
      description
      active
    }`
  },
  programPatients: {
    programPatients: gql`fragment programPatients on ProgramPatients {
      collection {
        id
        active
        startDate
        endDate
        ...program
      }
    }`
  },
  tests: {
    test: gql`fragment test on Test {
      id
      title
      questions {
        collection {
          id
          text
          type
          description
          questionOrder
          options {
            collection {
              ...options
            }
          }
        }
      }
    }`,
    answer: gql`fragment answer on Answer {
      id
      question
      value
      performedTest {
        id
      }
    }`,
    options: gql`fragment options on QuestionOption {
      id
      answer
      punctuation
    }`
  },
  image: {
    image: gql`fragment image on Multimedia {
      id
      name
      nameOnDisk
      path
      type
    }`
  },
  exercises: {
    exercises: gql`fragment exercise on Exercise {
      id
      title
      description
      repetitions
    }`
  },
  activities: {
    activities: gql`fragment activities on Activity {
        id
        title
        description
        image {
          ...image
        }
        exercises {
          collection {
           ...exercise
          }
        }
      tematicCategory {
        ...tematicCategory
      }
    }`
  },
  contents: {
    content: gql`fragment contents on Content {
      id
      title
      description
      link
      image {
        ...image
      },
      tematicCategory {
        ...tematicCategory
      }
      translation {
        ...translation
      }
    }`
  },
  tematic: {
    category: gql`fragment tematicCategory on TematicCategory {
      id
      name
      internalName
    }`
  },
  userRecord: {
    userRecord: gql`fragment userRecord on UserRecord{
      id
      value
      owner {
        id
      }
    }`
  },
  quickConsult: {
    messages: gql`fragment consultMessage on ConsultMessage {
      id
      _id
      date
      viewed
      sender
      receiver
      text
    }`,
    quickConsult: gql`fragment quickConsults on QuickConsult{
      id
      _id
      title
      unread
      category
      creationTime
      active
      consultMessage {
        ...consultMessage
      }
    }`
  },
  prescriptions: {
    prescription: gql`fragment prescription on Prescription {
      id
      code
      description
      posology
      adminVia
      frecuency
      treatmentDuration
    }`
  },
  translations: {
    translation: gql`fragment translation on ProgramItemTranslation {
      locale
      title
      description
    }`
  },
  specialists: {
    specialist: gql`fragment specialists on Specialist {
      id
      name
      lastname
    }`
  },
};
