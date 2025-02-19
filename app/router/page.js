// app/dynamic-renderer/page.js
// 'use client'
import React from 'react';
import DynamicRenderer from './DynamicRenderer';
// import { addFolderToProject } from '@/resources/clients/helper';


export default function ClientRouter() {
  // addFolderToProject('Metabolomics', 'camelina', '')
  return (
    <div>
        <DynamicRenderer />
    </div>
  )
}

