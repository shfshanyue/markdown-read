import TurndownService from "turndown"
import * as juejin from './juejin'
import * as sf from './sf'
import * as zhihu from './zhihu'
import * as weixin from './weixin'
import * as mdn from './mdn'

interface PlatformProcess {
  filter: (doc: Document) => boolean;
  processDocument: (doc: Document) => void;
  turndownPlugins: (turndown: TurndownService) => void;
  skip?: boolean;
}

export const platforms: PlatformProcess[] = [juejin, sf, zhihu, weixin, mdn]
