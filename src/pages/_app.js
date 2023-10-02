import '@/styles/globals.css'
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store/index";
import { PersistGate } from "redux-persist/integration/react";
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }) {
  return (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </PersistGate>
    </Provider>

  )
}
