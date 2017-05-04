/// <reference path="../node_modules/firebase/firebase.d.ts" />

interface DataSnapshot<T> extends firebase.database.DataSnapshot {
  val(): T;
}

declare var process: {
  VERSION: string
  env: Record<string, any>
};

declare var require: (moduleName: string) => any;

type Action<ActionType> = {
  [key: string]: any
  type?: ActionType
};
