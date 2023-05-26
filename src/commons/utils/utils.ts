import { Request } from "express";

export const constructApiResourceUrl = (
  req: Request,
  resource: string,
  queryString?: string
) => {
  if (!queryString) {
    return `${req.protocol}://${req.get("host")}${
      resource ? `/${resource}` : ""
    }`;
  }

  return `${req.protocol}://${req.get("host")}${
    resource ? `/${resource}` : ""
  }?${queryString}`;
};

export const analyzeNextPage = (
  currentPage: number,
  dataPerPage: number,
  totalData: number,
  constructUrlFunction: (...a: any[]) => string | null
) => {
  const hasNextPage = currentPage * dataPerPage < totalData;
  if (hasNextPage) {
    return constructUrlFunction();
  } else {
    return null;
  }
};

export const analyzePrevPage = (
  currentPage: number,
  resultLength: number,
  constructUrlFunction: (...a: any[]) => string | null
) => {
  if (currentPage === 1 || resultLength === 0) {
    return null;
  } else {
    return constructUrlFunction();
  }
};

export const isNumericString = (value: string | undefined) => {
  if (!value) return false;
  return /^\d+$/.test(value);
};
