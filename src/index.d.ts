interface Process {
  VERSION: string;
  env: Record<string, any>;
}

type Action<ActionType> = {
  [key: string]: any
  type?: ActionType
};
