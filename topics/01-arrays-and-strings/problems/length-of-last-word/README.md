# Length of Last Word

## Problem

Given a string `s` consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring of non-space characters.

## Recognition

Trailing spaces + last token length → scan from the end, skip spaces, then count letters.

## Key Extract

Walk backward past spaces, then count until the next space (or start). Avoids allocating a split array.
