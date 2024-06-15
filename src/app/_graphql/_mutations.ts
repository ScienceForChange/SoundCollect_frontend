import {gql} from 'apollo-angular';
import {fragments} from './_fragments';

export const mutations = {
  user: {
    update: () => gql`
    mutation updatePatient(
      $id: ID!,
      $email: String,
      $name: String,
      $birthdate: Int,
      $lastname: String,
      $gender: String,
      $mobile: String,
      $locale: String
    ) {
      updatePatient(
        input: {
          id: $id,
          email: $email,
          name: $name,
          birthdate: $birthdate,
          lastname: $lastname,
          gender: $gender,
          mobile: $mobile,
          locale: $locale
        }
      ) {
        patient {
          id
        }
      }
    }`
  },
  finishTest: {
    createFinishedTest: () => gql`
      mutation createFinishedTest(
        $clientMutationId: String,
        $date: Int!,
        $patient: String,
        $programPatient: String,
        $programItem: String!
      ) {
        createFinishedTest(
          input: {
            clientMutationId: $clientMutationId,
            date: $date,
            patient: $patient,
            programPatient: $programPatient,
            programItem: $programItem
          }
        ) {
          finishedTest {
            id
          }
          clientMutationId
        }
      }`
  },
  answer: {
    create: () => gql`mutation createAnswer(
      $question: String!,
      $value: Iterable!,
      $performedTest: String!
    ) {
      createAnswer(
        input: {
          question: $question,
          value: $value,
          performedTest: $performedTest
        }
      ) {
        answer {
          ...answer
        }
      }
    }${fragments.tests.answer}`
  },
  exercises: {
    createFinishedExercise: () => gql`mutation createFinishedExercise(
      $date: Int!,
      $finishTime: Int!,
      $patient: String,
      $programPatient: String,
      $programItem: String!,
      $parentActivity: String,
      $video:String,
      $videoKeyPoints:String,
    ) {
      createFinishedExercise(
        input: {
          date: $date,
          finishTime: $finishTime,
          patient: $patient,
          programPatient: $programPatient,
          programItem: $programItem,
          parentActivity: $parentActivity,
          video:$video,
          videoKeyPoints:$videoKeyPoints
        }
      ) {
        finishedExercise {
          id
        }
      }
    }`,
    updateFinishedExercise: () => gql`mutation updateFinishedExercise(
      $id: ID!,
      $score: Int
    ) {
      updateFinishedExercise(
        input: {
          id: $id,
          score: $score
        }
      ) {
        finishedExercise {
          id
        }
      }
    }`
  },
  activity: {
    createFinish: () => gql`
      mutation createFinishedActivity(
        $clientMutationId: String,
        $date: Int!,
        $patient: String,
        $programPatient: String,
        $programItem: String!
      ) {
        createFinishedActivity(
          input: {
            clientMutationId: $clientMutationId,
            date: $date,
            patient: $patient,
            programPatient: $programPatient,
            programItem: $programItem
          }
        ) {
          finishedActivity {
            id
          }
          clientMutationId
        }
      }`
  },
  userRecord: {
    create: () => gql`mutation createUserRecord(
      $date: Int!, $key: String!, $detail: String, $clientMutationId: String, $value: String!, $owner: String!, $programPatient:String) {
      createUserRecord(
        input: {
          date: $date, keyId: $key, detail: $detail, clientMutationId: $clientMutationId, valueStringify: $value, owner: $owner,programPatient:$programPatient}
      ) {
        userRecord {
          ...userRecord
        }
      }
    }${fragments.userRecord.userRecord}`,
    update: () => gql`mutation updateUserRecord($id: ID!, $value: String) {
      updateUserRecord(
        input: {id: $id, value: $value}
      ) {
        userRecord {
          ...userRecord
        }
      }
    }${fragments.userRecord.userRecord}`,
    remove: () => gql`mutation deleteUserRecord($id: ID!) {
      deleteUserRecord(
        input: {id: $id}
      ) {
        userRecord {
          id
        }
      }
    }`,
  }
};
