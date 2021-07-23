import { Message } from 'element-ui'
import { decodeBase64 } from '~/common/js/utils'
export default function({ $axios, redirect }) {
  $axios.onRequest((config) => {
    // eslint-disable-next-line no-console
    try {
      if (config.headers.common.referer) {
        delete config.headers.common.referer
      }
    } catch (err) {
      console.log('onRequest err:', err)
    }
    // console.log('Making request to ', config)
    return config
  })

  $axios.onResponse((response) => {
    // console.log(`response:`, response)
    if (!response.data.success && response.data.message) {
      if (process.client) {
        Message({
          message: response.data.message || 'Error',
          type: 'error',
          duration: 2 * 1000
        })
        return Promise.reject(response.data)
      }
    }
    if (response.encrypt_ver === 1 && response.data) {
      try {
        const buf = response.data.replace(/\n/g, '').split('')
        for (let i = 0; i < Math.floor(buf.length / 3); i++) {
          const c = buf[i * 3]
          buf[i * 3] = buf[i * 3 + 2]
          buf[i * 3 + 2] = c
        }
        response.data = JSON.parse(decodeBase64(buf.join('')))
      } catch (err) {
        console.error(err)
      }
    }
    return Promise.resolve(response.data)
  })

  $axios.onError((error) => {
    console.log('onError: ', error)
    const code = parseInt(error.response && error.response.status)
    // eslint-disable-next-line no-console
    console.log('response error code ', code)
    if (code === 400) {
      redirect('/error')
    }

    if (code === 500) {
      redirect('/error')
    }

    if (code === 403) {
      console.log(`error code ${code}`)
      redirect('/')
    }

    if (code === 404) {
      redirect('/error')
    }
  })
}
