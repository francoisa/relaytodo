import fs from 'fs';
import path from 'path';
import { TodoSchema } from '../src/server/todolistSchema';
import { printSchema } from 'graphql';

const schemaPath = path.resolve(__dirname, '../src/schema.graphql');

fs.writeFileSync(schemaPath, printSchema(TodoSchema));

console.log('Wrote ' + schemaPath);
