export class PaginatedResultAssembler<T> {
  count: number;
  next: string | null;
  prev: string | null;
  result: T[];
  constructor(
    count: number,
    next: string | null,
    prev: string | null,
    result: T[]
  ) {
    this.count = count;
    this.next = next;
    this.prev = prev;
    this.result = result;
  }
}
