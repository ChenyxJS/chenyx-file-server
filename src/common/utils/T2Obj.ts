export function T2Obj<T>() {
    // 返回一个包含T类型所有属性的对象
    return {} as T;
}
export function T2Arr<T>() {
    // 返回一个包含T类型所有属性的对象
    return [{} as T, {} as T] as T[];
}
