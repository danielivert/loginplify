import App, { Container } from 'next/app'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import withData from '../lib/withData'
import { getHostname } from '../utils/env'

class MyApp extends App<any> {
  static async getInitialProps({ Component, ctx }: any) {
    let pageProps = {
      query: null
    }

    // Crawls on all pages that contain queries and mutations and loads them before the page is loaded on the client
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    // this exposes the query to the user
    pageProps.query = ctx.query

    const hostname = getHostname(ctx.req)

    return { pageProps, hostname }
  }
  render() {
    const { Component, apollo, pageProps, hostname } = this.props

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <ApolloHooksProvider client={apollo}>
            <Component {...pageProps} hostname={hostname} />
          </ApolloHooksProvider>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withData(MyApp)
