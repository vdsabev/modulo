declare var firebase: any;

type FirebaseSnapshot<T> = {
  key: string
  val(): T;
};

declare var process: {
  VERSION: string
  env: Record<string, any>
};

declare var require: (moduleName: string) => any;
