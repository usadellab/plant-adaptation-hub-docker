'use client'
import React from 'react'
import WelcomePage from '../components/WelcomePage'
import GeoLocator from '../components/GeoLocator'
import GWAS from '../components/PerformGWAS'
import PCA from '../components/PCA'
import MDS from '../components/MDS'
import View from '../components/backup/GenomeBrowser'
import FAQs from '../components/FAQs'
import Contact from '../components/Contact'
import Downloads from '../components/Downloads'
import { VisPheno } from '../components/VisPheno'
import { usePathname, useSearchParams } from 'next/navigation'
import Login from '../components/LoginPage'
import SummaryStatistics from '../components/SummaryStatistics'
import PhyloTreeComp from '../components/PhyloTreeComp'
import PeopleComponent from '../components/PeopleComponent'
import PerformGWAS from '../components/PerformGWAS'
import PerformPCA from '../components/PerformPCA'
import PerformMDS from '../components/PerformMDS'
import Provenience from '../components/Provenience'
import GenomeOverView from '../components/GenomeOverView'
import GenomeAnnotation from '../components/GenomeAnnotation'
import GenomePhylogeny from '../components/GenomePhylogeny'
import GenomeStructure from '../components/GenomeStructure'
import CompareGenomes from '../components/CompareGenomes'
import People from '../components/People'
import DownloadComponent from '../components/DownloadsComponent'
import Impressum from '../components/Impressum'
import GDPRC from '../components/GDPRC'
import GenomeBrowserStandAlone from '../components/GenomeBrowserStandAlone'
import DatabaseExplorer from '../components/DatabaseExplorer'
import GenomeAssemblies from '../components/GenomeAssemblies'
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
