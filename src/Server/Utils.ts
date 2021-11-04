import { parse } from 'url'

export class Utils {
  public static getUrlBasePath(url: string | undefined): string {
    if (typeof url === 'string') {
      const parsedUrl = parse(url)
      return parsedUrl.pathname!.split('/')[1]
    }
    return 'a'
  }
}
