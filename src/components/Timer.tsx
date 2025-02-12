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
  const [ holdingTime, setHoldingTime ] = useState(0)
  const [ timerOn, setTimerOn ] = useState(false)
  let initialTime = 0
  let currentTime = 0

  useEffect(()=>{
    let interval: (NodeJS.Timer | null) = null;

    if(timerOn){
      // eslint-disable-next-line react-hooks/exhaustive-deps
      initialTime = new Date().getTime()
      interval = setInterval(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentTime = new Date().getTime()
        setTime(currentTime - initialTime )
        // setTime(prevTime => prevTime + 10 )
      }, 10)
    } else {
      clearInterval(interval as unknown as NodeJS.Timer)
    }

    return () => clearInterval(interval  as unknown as NodeJS.Timer)

  },[timerOn])

  function changeStateByInputDown() {
    switch (siteState){
      case 'initial':
        setTime(0)           
        initialTime = 0
        currentTime = 0
        setHoldingTime(new Date().getTime())
        setSiteState('holding')
        break;
      case 'running':
        setSiteState('initial')          
        setTimerOn(false)
        break;
      // case 'finished':
      //   setTime(0) 
      //   initialTime = 0
      //   currentTime = 0
      //   setHoldingTime(new Date().getTime())
      //   setSiteState('holding')
      //   break;        
    }
  }

  function changeStateByInputUp(){
    if(siteState === 'holding'){           
      //this makes the user wait a little in space-bar 
      if((holdingTime + 500) < (new Date().getTime())){
        setSiteState('running')
        setTimerOn(true)
      } else {          
        setSiteState('initial')          
        setTimerOn(false)
      }
    }
  }

  const detectKeyDown = (e: { key: any; }) => {
    if(e.key === ' '){
      changeStateByInputDown()      
    }
  }  

  const detectKeyUp = (e: { key: any; }) => {
    if(e.key === ' '){
      changeStateByInputUp()
    }
  }  

  const detectMouseDown = () => {    
    changeStateByInputDown() 
  }    

  const detectMouseUp = () => {    
    changeStateByInputUp()
  }      

  function saveNewResult(){
    if(siteState === 'initial' && time > 0){
      addNewResult(time)
    }    
  }


  useEffect(()=>{
    saveNewResult()

      document.addEventListener('keydown', detectKeyDown, true);
      document.addEventListener('keyup', detectKeyUp, true);
      document.addEventListener('touchstart', detectMouseDown, true);
      document.addEventListener('touchend', detectMouseUp, true);
    return () => {
      document.removeEventListener('keydown', detectKeyDown, true);
      document.removeEventListener('keyup', detectKeyUp, true);
      document.removeEventListener('touchstart', detectMouseDown, true);
      document.removeEventListener('touchend', detectMouseUp, true);       
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[siteState])  

  return (
      <Flex
        fontWeight='black' 
        transition=' 0.2s ease-in-out'
        fontSize={['30px','40px',
          Math.min(200, 30+(time/1000))+'px'
        ]} 
        marginTop={['15px','20px',
          Math.max(-100, (-1*(50+(time/1000))/4)) +'px'
        ]}
        // fontSize='40px' 
        // marginTop='20px'
        _hover={{
          fontSize: Math.min(300, 50+(time/1000))+'px',
          marginTop: Math.max(-100, (-1*(50+(time/1000))/4)) +'px'
        }}      
      >      

          <Tooltip label='Segure espaço por 0,5s para começar' placement='top'>
            <Text
              id='timer'
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
          </Tooltip>

      </Flex>

  )
}

