import { useTranslation } from "react-i18next"
import { useThemeFront } from "data/settings/Theme"
import { FlexColumn } from "components/layout"
import styles from "./Welcome.module.scss"

const Welcome = () => {
  const { t } = useTranslation()
  const front = useThemeFront()

  return (
    <FlexColumn gap={20} className={styles.component}>
      <img src={front} alt="GNC Wallet" width={105} height={120} />
      <p className={styles.content}>{t("Connect to GNC blockchain")}</p>
    </FlexColumn>
  )
}

export default Welcome
