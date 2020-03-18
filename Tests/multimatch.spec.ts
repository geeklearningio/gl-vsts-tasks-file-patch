import { applyMatch } from '../Tasks/JsonPatch/common/multimatch';

describe('Multimatch Tests', () => {
  const directory = 'C:\\root';
  const files = [
    'C:\\root\\sample.json',
    'C:\\root\\sample.nuspec',
    'C:\\root\\package1\\sample.json',
    'C:\\root\\package1\\spec.nuspec',
    'C:\\root\\package1\\spec.notspec',
    'C:\\root\\sample.js',
    'C:\\root\\package2\\sample.cs',
    'C:\\root\\package2\\sample.json'
  ];

  it('should match deep search by extension', () => {
    const result = applyMatch(directory, '**/*.nuspec', files);

    expect(result).toEqual([
      'C:\\root\\sample.nuspec',
      'C:\\root\\package1\\spec.nuspec'
    ]);
  });

  it('should match deep search by extension with exclustion', () => {
    const result = applyMatch(directory, '**/*.nuspec\n!sample.nuspec', files);

    expect(result).toEqual(['C:\\root\\package1\\spec.nuspec']);
  });

  it('should match exact name at root', () => {
    const result = applyMatch(directory, 'sample.json', files);

    expect(result).toEqual(['C:\\root\\sample.json']);
  });

  it('should match exact name', () => {
    const result = applyMatch(directory, 'package2/sample.json', files);

    expect(result).toEqual(['C:\\root\\package2\\sample.json']);
  });
});
