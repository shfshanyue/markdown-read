import TurndownService from "turndown"
import * as juejin from './juejin'
import * as zhihu from './zhihu'
import * as weixin from './weixin'
import * as mdn from './mdn'
import * as weekly from './weekly'
import { CompatDocument } from '../readability'

interface PlatformProcess {
  filter: (doc: CompatDocument, url?: URL) => boolean;
  processDocument?: (doc: CompatDocument) => void | Promise<void>;
  turndownPlugins?: (turndown: TurndownService) => void;
  skip?: boolean;
}

export const platforms: PlatformProcess[] = [juejin, zhihu, weixin, mdn, weekly]
