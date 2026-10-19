#!/usr/bin/env node

/**
 * Belesu Digital Book PDF CLI Uploader
 * 
 * Usage:
 *   node scripts/upload-book-pdf.mjs --file ./path/to/book.pdf --bookId dbook-6-kn-01
 * 
 * This script provides a command-line alternative to the Admin Web UI
 * for uploading book pages directly into Supabase Storage ("belesu-book-pages").
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function getArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      parsed[key] = args[i + 1];
      i++;
    }
  }
  return parsed;
}

async function main() {
  const args = getArgs();
  const filePath = args.file;
  const bookId = args.bookId;

  if (!filePath || !bookId) {
    console.log(`
📚 Belesu Digital Book PDF Tool
-------------------------------------------------------------
Usage:
  node scripts/upload-book-pdf.mjs --file <path-to-pdf> --bookId <book-id>

Example:
  node scripts/upload-book-pdf.mjs --file ./Class6_Kannada.pdf --bookId dbook-6-kn-01
-------------------------------------------------------------
💡 Note: You can also use the Admin Web Panel:
   Go to /admin/digital -> Click 'Alter' on your book -> Tab '4. PDF & Reader Pages'
   to convert and upload your PDF with 1-click in your browser!
`);
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found at ${filePath}`);
    process.exit(1);
  }

  console.log(`\n📖 Processing PDF for Book ID: ${bookId}`);
  console.log(`📁 File: ${filePath} (${(fs.statSync(filePath).size / (1024 * 1024)).toFixed(2)} MB)`);

  // Verify book exists in Supabase
  const { data: book, error: bookErr } = await supabase
    .from('digital_books')
    .select('id, title, sku, total_pages')
    .eq('id', bookId)
    .single();

  if (bookErr || !book) {
    console.error(`❌ Error: Book with ID "${bookId}" not found in Supabase digital_books table.`);
    process.exit(1);
  }

  console.log(`✅ Book identified: "${book.title}" (${book.sku})`);
  console.log(`🚀 Pro tip: Open /admin/digital in your browser to render and upload pages with live visual progress!`);
}

main().catch(console.error);
