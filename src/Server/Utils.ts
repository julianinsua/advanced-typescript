import { parse, UrlWithParsedQuery } from 'url'

export class Utils {
  public static getUrlBasePath(url: string | undefined): string {
    if (typeof url === 'string') {
      const parsedUrl = parse(url)
      return parsedUrl.pathname!.split('/')[1]
    }
    return 'a'
  }

  public static getUrlParameters(url: string | undefined): UrlWithParsedQuery | undefined {
    if (url) {
      return parse(url, true)
    } else {
      return undefined
    }
  }
}
