import { ALEO_FIELD_MODULUS } from "../params/AleoConstants";
import * as Aleo from '@demox-labs/gpu-wasm-expose';
import { BigIntPoint } from "../types";

export const addFields = async (field1: string, field2: string): Promise<string> => {
  return Aleo.Address.add_fields(field1, field2);
};

export const bulkAddFields = async (inputs1: string[], inputs2: string[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < inputs1.length; i++) {
    results.push(await Aleo.Address.add_fields(inputs1[i], inputs2[i]));
  }
  return results;
};

export const mulFields = async (field1: string, field2: string): Promise<string> => {
  return Aleo.Address.mul_fields(field1, field2);
};

export const bulkMulFields = async (inputs1: string[], inputs2: string[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < inputs1.length; i++) {
    results.push(await Aleo.Address.mul_fields(inputs1[i], inputs2[i]));
  }
  return results;
};

export const subFields = async (field1: string, field2: string): Promise<string> => {
  return Aleo.Address.sub_fields(field1, field2);
};

export const bulkSubFields = async (inputs1: string[], inputs2: string[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < inputs1.length; i++) {
    results.push(await Aleo.Address.sub_fields(inputs1[i], inputs2[i]));
  }
  return results;
};

export const doubleField = async (field: string): Promise<string> => {
  return Aleo.Address.double_field(field);
};

export const bulkDoubleFields = async (inputs: string[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < inputs.length; i++) {
    results.push(await Aleo.Address.double_field(inputs[i]));
  }
  return results;
};

export const invertField = async (field: string): Promise<string> => {
  return Aleo.Address.invert_field(field);
};

export const bulkInvertFields = async (inputs: string[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < inputs.length; i++) {
    results.push(await Aleo.Address.invert_field(inputs[i]));
  }
  return results;
};

export const powField = async (field: string, exponent: string): Promise<string> => {
  return Aleo.Address.pow_field(field, exponent);
};

export const bulkPowFields = async (inputs1: string[], inputs2: string[]): Promise<string[]> => {
  const results: string[] = [];
  // console.log(inputs2);
  for (let i = 0; i < inputs1.length; i++) {
    results.push(await Aleo.Address.pow_field(inputs1[i], inputs2[i]));
  }
  return results;
}

export const sqrtField = async (field: string): Promise<string> => {
  return Aleo.Address.sqrt(field);
};

export const bulkSqrtFields = async (inputs1: string[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < inputs1.length; i++) {
    try {
      results.push(await Aleo.Address.sqrt(inputs1[i]));
    } catch (e) {
      console.log(inputs1[i], e);
    }
  }
  return results;
};

export const addGroups = async (group1: string, group2: string): Promise<string> => {
  return Aleo.Address.add_points(group1, group2);
};

export const bulkAddGroups = async (inputs1: string[], inputs2: string[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < inputs1.length; i++) {
    results.push(await Aleo.Address.add_points(inputs1[i], inputs2[i]));
  }
  return results;
};

export const reduceGroups = async (groups: string[]): Promise<string[]> => {
  const result = await groups.reduce((acc, curr) => Aleo.Address.add_points(acc, curr), '0group');
  return [result];
}

export const groupScalarMul = async (group: string, scalar: string): Promise<string> => {
  return Aleo.Address.group_scalar_mul(group, scalar);
};

export const bulkGroupScalarMul = async (inputs1: string[], inputs2: string[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < inputs1.length; i++) {
    results.push(await Aleo.Address.group_scalar_mul(inputs1[i], inputs2[i]));
  }
  return results;
};

export const bulkPowFields17 = async (inputs1: string[]): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < inputs1.length; i++) {
    results.push(await Aleo.Address.pow_field(inputs1[i], '17field'));
  }
  return results;
};

export const msm = async (groups: string[], scalars: string[]): Promise<string> => {
  return Aleo.Address.msm(groups, scalars);
};

export const bls12_377_msm = async (g1Affines: { x: string, y: string }[], scalars: string[]): Promise<string> => {
  return Aleo.Address.bls12_377_msm(g1Affines.map(aff => aff.x), g1Affines.map(aff => aff.y), scalars);
};

// export const create_random_g1_point = async (inputSize: number): Promise<{ x: string, y: string }[]> => {
//   const points: { x: string, y: string }[] = [];
//   for (let i = 0; i < inputSize; i++) {
//     const generatedPoint = Aleo.Address.create_random_g1_point();
//   }
// };

export const createRandomAffinePoints = async (inputSize: number): Promise<BigIntPoint[]> => {
  const points: BigIntPoint[] = [];
  const regex = /x=(\d+),\s*y=(\d+)/;
  for (let i = 0; i < inputSize; i++) {
    const pk = new Aleo.PrivateKey();
    const address = pk.to_address();
    const affineString = address.to_affine();
    const match = affineString.match(regex);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const x = BigInt(match![1]);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const y = BigInt(match![2]);
    const t = x * y % ALEO_FIELD_MODULUS;
    const point: BigIntPoint = { x, y, t, z: BigInt(1)};
    points.push(point);
    if (points.length % 10000 === 0) {
      console.log(`Generated ${points.length} points`);
    }
  }

  return points;
};
