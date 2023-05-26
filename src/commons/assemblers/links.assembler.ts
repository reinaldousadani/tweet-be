export class LinksAssembler<T extends Record<string, any>> {
  private sourceObject: T & {
    _links: Record<string, any>;
  };

  constructor(
    sourceObject: T,
    links: Array<{ name: string; targetUrl: string }>
  ) {
    const linkObj = { _links: {} };

    const mergedObjects = { ...sourceObject, ...linkObj };

    for (const link of links) {
      mergedObjects["_links"] = {
        ...mergedObjects["_links"],
        [`${link.name}`]: `${link.targetUrl}`,
      };
    }

    this.sourceObject = mergedObjects;
  }

  getObject() {
    return this.sourceObject;
  }
}
