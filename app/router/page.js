// app/dynamic-renderer/page.js
// 'use client'
import React, { Suspense } from 'react';
import DynamicRenderer from './DynamicRenderer';
// import { addFolderToProject } from '@/resources/clients/helper';


export default function ClientRouter() {
  // addFolderToProject('Metabolomics', 'camelina', '')
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicRenderer />
      </Suspense>
    </div>
  )
}

