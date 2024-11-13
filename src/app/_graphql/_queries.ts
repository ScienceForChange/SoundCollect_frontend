import { gql } from 'apollo-angular';
import { fragments } from './_fragments';

export const queries = {
  patient: {
    getById: () => gql`
      query getPatient($id: ID!) {
        patient(id: $id) {
          ...patient
        }
      }${fragments.patient.patient}${fragments.group.group}${fragments.group.group}
       ${fragments.unlockedItems.unlockedItems}${fragments.specialists.specialist}`,
    activitiesPatients: () => gql`
      query activitiesPatients($username: String) {
        activitiesPatients(username: $username) {
          collection {
            condensedActivities
          }
        }
      }`,
    condensedPatient: () => gql`
      query condensedPatient($id: ID!) {
        condensedPatient(id: $id) {
            condensedActivities
        }
      }`,
  },
  test: {
    getById: () => gql`
      query getTest($id: ID!) {
        test(id: $id) {
          ...test
        }
      }${fragments.tests.test}${fragments.tests.options}`,
  },
  programPatients: {
    get: () => gql`
      query get($patient_id: Int, $program_id: Int) {
        programPatients(patient_id: $patient_id, program_id: $program_id) {
          collection {
            id
          }
        }
      }`,
    getTotalAndProgressDays: () => gql`
      query getTotalAndProgressDays($id: ID!) {
        programPatient(id: $id) {
          id
          totalDays
          progressDays
        }
      }`
  },
  programs: {
    getRest: () => gql`
    query getRest($program_id: ID!){
      program(id:$program_id){
          restBetweenExercises
      }
    }`,
    getProgramDescription: () => gql`
    query getProgramDescription($id:ID!){
    program(id:$id){
      description
    }
	}`,
  },
  activities: {
    getAll: () => gql`
      query getAll($tematicCategory_id: Int) {
        activities(tematicCategory_id: $tematicCategory_id) {
          collection {
            ...activities
          }
        }
      }${fragments.activities.activities}${fragments.image.image}${fragments.exercises.exercises}`,
    getById: () => gql`
      query getById($id: ID!) {
        activity(id: $id) {
          ...activities
        }
      }${fragments.activities.activities}${fragments.image.image}${fragments.exercises.exercises}${fragments.tematic.category}`
  },
  exercises: {
    getAll: () => gql`
      query getAll($itemsPerPage: Int, $page: Int, $active: Boolean, $isGeneral: Boolean, $tematicCategory_id: Int) {
        exercises(itemsPerPage: $itemsPerPage, page: $page, active: $active, isGeneral: $isGeneral,
                  tematicCategory_id: $tematicCategory_id) {
          collection {
            id
            description
            title
            repetitions
            series
            image {
              ...image
            }
          }
        }
      }${fragments.image.image}`,
    getById: () => gql`
      query getById($id: ID!) {
        exercise(id: $id) {
            id
            title
            description
            repetitions
            series
            image {
              ...image
            }
        }
      }${fragments.image.image}`
  },
  user: {
    getByIdSimple: () => gql`
       query getPatient($id:ID!){
        patient(id:$id){
                id
                name
                birthdate
                email
                lastname
                mobile
                gender
                locale
        }
    }`
  },
  userRecord: {
    existUserRecord: () => gql`
    query existUserRecord($key:String,$programPatient_id:Int,$range:String){
      userRecords(keyId:$key,programPatient_id:$programPatient_id,date:{between:$range}){
          collection{
              id
          }
      }
  }`,
    getUserRecord: () => gql`
    query getUserRecord($key:String,$owner:Int,$programPatient:Int,$range:String){
      userRecords(keyId:$key,owner_id:$owner,programPatient_id:$programPatient,date:{between:$range}){
          collection{
              id
              date
              value
              keyId
              programPatient{
                id
                program{
                  title
                }
              }
          }
      }
  }`
  }
};
