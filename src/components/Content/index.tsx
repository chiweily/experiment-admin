// 将表单中重用的样式进行封装

import { ReactNode } from 'react';
import styles from './index.module.css'

function Content({children, title, operation}:
    {
        children: ReactNode;
        title: string;
        operation?: ReactNode
    }
    ) {
        return( 
            <>
                <div className={styles.title}>
                    {title}
                    <span className={styles.btn}>{operation}</span>
                </div>
                <div className={styles.content}>{children}</div>
            </>
        )
}

export default Content;