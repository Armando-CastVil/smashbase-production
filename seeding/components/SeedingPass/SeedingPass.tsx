import styles from "../../../styles/SeedingPass.module.css"
export default function SeedingPass() {
    return (
        <div className={styles.content}>

            <div className={styles.topRow}>
                <div className={styles.topLeftCol}>
                    <div className={styles.title}>
                        Seeding Pass ⚡
                    </div>

                </div>

                <div className={styles.topRightCol}>
                    <div className={styles.subTitle}>
                        Start seeding YOUR tournaments excellently!
                    </div>
                </div>
            </div>

            <div className={styles.middleRow}>
                
            </div>

            <div className={styles.bottomRow}>
            <div className={styles.vouchRow}>
                <p>TRUSTED SEEDERS OF: </p>
                <div className={styles.vouchRectangle}>
                    <p>CROWN III</p>
                    <p>WAVEDASH 2023</p>
                    <p>GET ON MY LEVEL</p>
                    <p>COINBOX</p>
                </div>
            </div>
            </div>

        </div>

    );
}