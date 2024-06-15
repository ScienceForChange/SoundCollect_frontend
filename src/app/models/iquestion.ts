export interface ITest {
  id:         string;
  title:      string;
  questions:  IQuestions;
}

interface IQuestions {
  collection: IQuestionsCollection[];
}

interface IQuestionsCollection {
  id:            string;
  text:          string;
  type:          string;
  description:   string;
  questionOrder: number;
  options:       IOptions;
}

interface IOptions {
  collection: IOptionsCollection[];
}

interface IOptionsCollection {
  id:          string;
  answer:      string;
  punctuation: number;
}
