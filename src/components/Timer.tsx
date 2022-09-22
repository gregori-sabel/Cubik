import { Flex, Text, Tooltip } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SiteState } from '../pages'


interface SiteStateProps{
  siteState: SiteState,
  setSiteState(state: SiteState): void,
  addNewResult(newResult: number): void,
  formatTime(time:number): string,
}

export default function Timer({ setSiteState, siteState, addNewResult, formatTime }: SiteStateProps){ 
  const [ time, setTime ] = useState(0)
  const [ timerOn, setTimerOn ] = useState(false)

  useEffect(()=>{
    let interval: (NodeJS.Timer | null) = null;

    if(timerOn){
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10 )
      }, 10)
    } else {
      clearInterval(interval as unknown as NodeJS.Timer)
    }

    return () => clearInterval(interval  as unknown as NodeJS.Timer)

  },[timerOn])

  const detectKeyDown = (e: { key: any; }) => {
    if(e.key === ' '){
      switch (siteState){
        case 'initial':
          setTime(0) 
          setSiteState('holding')
          break;
        case 'running':
          setSiteState('finished')
          setTimerOn(false)
          break;
        case 'finished':
          setTime(0) 
          setSiteState('holding')
          break;        
      }
      
    }
  }  
  const detectKeyUp = (e: { key: any; }) => {
    if(e.key === ' '){
      if(siteState === 'holding'){
        setSiteState('running')
        setTimerOn(true)
      }
      
    }
  }  

  function saveNewResuld(){
    if(siteState === 'finished'){
      addNewResult(time)
    }    
  }


  useEffect(()=>{
    saveNewResuld()

    document.addEventListener('keydown', detectKeyDown, true);
    document.addEventListener('keyup', detectKeyUp, true);
    return () => {
      document.removeEventListener('keydown', detectKeyDown, true);
      document.removeEventListener('keyup', detectKeyUp, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[siteState])  

  return (
      <Flex
        fontWeight='black' 
        // fontSize='3xl' 
        transition=' 0.2s ease-in-out'
        // fontSize={Math.min(200, 30+(time/1000))+'px'} 
        // marginTop={Math.max(-100, (-1*(50+(time/1000))/4)) +'px'}
        fontSize='40px' 
        marginTop='20px'
        // _hover={{
        //   fontSize: Math.min(300, 50+(time/1000))+'px',
        //   marginTop: Math.max(-100, (-1*(50+(time/1000))/4)) +'px'
        // }}      
      >      
        <Tooltip label='Clique espaço para começar'>
          <Text 
            // _after={ siteState === 'initial' ? {
            //   content:`'[ Espaço ]'`,
            //   width: '200px',
            //   fontSize: '18px',
            //   fontWeight: 'light',
            //   position: 'absolute',
            //   top: '80px',
            //   left: '25px'
            // }: { }}
          >
            {formatTime(time)}
          </Text>
        </Tooltip >
      </Flex>

  )
}

