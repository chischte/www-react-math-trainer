/**
 *
 * Enums were partly implemented but then removed again because they led to
 * a database folder structure containing of numbers instead of strings,
 * which made it very difficult to debug.
 * The Use of enums has been replaced by switch case statements, detecting
 * invalid string values
 *
 */

export const DisciplineEnum = Object.freeze({
  addition: 1,
  subtraction: 2,
  multiplication: 3,
  division: 4,
});
