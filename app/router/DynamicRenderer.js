'use client'
import React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const WelcomePage = dynamic(() => import('../components/WelcomePage'))
const GeoLocator = dynamic(() => import('../components/GeoLocator'))
const GWAS = dynamic(() => import('../components/PerformGWAS'))
const PCA = dynamic(() => import('../components/PCA'))
const MDS = dynamic(() => import('../components/MDS'))
const View = dynamic(() => import('../components/GenomeBrowser'))
const FAQs = dynamic(() => import('../components/FAQs'))
const Contact = dynamic(() => import('../components/Contact'))
const Downloads = dynamic(() => import('../components/Downloads'))
const VisPheno = dynamic(() => import('../components/VisPheno').then(mod => mod.VisPheno))
const Login = dynamic(() => import('../components/LoginPage'))
const SummaryStatistics = dynamic(() => import('../components/SummaryStatistics'))
const PhyloTreeComp = dynamic(() => import('../components/PhyloTreeComp'))
const PeopleComponent = dynamic(() => import('../components/PeopleComponent'))
const PerformGWAS = dynamic(() => import('../components/PerformGWAS'))
const PerformPCA = dynamic(() => import('../components/PerformPCA'))
const PerformMDS = dynamic(() => import('../components/PerformMDS'))
const Provenience = dynamic(() => import('../components/Provenience'))
const GenomeOverView = dynamic(() => import('../components/GenomeOverView'))
const GenomeAnnotation = dynamic(() => import('../components/GenomeAnnotation'))
const GenomePhylogeny = dynamic(() => import('../components/GenomePhylogeny'))
const GenomeStructure = dynamic(() => import('../components/GenomeStructure'))
const CompareGenomes = dynamic(() => import('../components/CompareGenomes'))
const People = dynamic(() => import('../components/People'))
const DownloadComponent = dynamic(() => import('../components/DownloadsComponent'))
const Impressum = dynamic(() => import('../components/Impressum'))
const GDPRC = dynamic(() => import('../components/GDPRC'))
const GenomeBrowserStandAlone = dynamic(() => import('../components/GenomeBrowserStandAlone'))
const DatabaseExplorer = dynamic(() => import('../components/DatabaseExplorer'))
const GenomeAssemblies = dynamic(() => import('../components/GenomeAssemblies'))

const DynamicRenderer = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const componentName = searchParams.get('component')

  const renderComponent = () => {
    switch (componentName) {
      case 'home':
        return <WelcomePage />

        case 'dbview':
          return <DatabaseExplorer />
  

      case 'germplasm':
        return <Provenience />

      case 'vispheno':
        return <VisPheno />

      case 'summary_statistics':
        return <SummaryStatistics />

      case 'gwas':
        return <PerformGWAS />

      case 'jb':
        return <GenomeBrowserStandAlone />

      case 'genome_overview':
        // return <GenomeOverView />
        return <GenomeAssemblies/>


      case 'assembly_comparison':
        return <CompareGenomes />

      case 'gs':
        return <GenomeStructure />

      case 'genome_annotation':
        return <GenomeAnnotation />

      case 'genome_phylogeny':
        return <GenomePhylogeny />

      case 'pca':
        return <PerformPCA />
      case 'mds':
        return <PerformMDS />

      case 'downloads':
        return <DownloadComponent />
      case 'faqs':
        return <FAQs />

      case 'contact':
        return <Contact />

      case 'PhyloTreeComp':
        return <PhyloTreeComp />
      case 'people':
        return <People />

      case 'impressum':
        return <Impressum />

      case 'gdprc':
        return <GDPRC />

      default:
        return <div>Component not found</div>
    }
  }

  return <div>{renderComponent()}</div>
}

export default DynamicRenderer
