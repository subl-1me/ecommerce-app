export default interface MetaData {
  stock?: number;
  hex?: string;
  percentage?: number;
  tags?: string[];
  dimensions?: Dimensions;
}

interface Dimensions {
  h: string;
  w: string;
}
