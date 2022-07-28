/* eslint-disable react/no-unescaped-entities */
// import { ButtonLink } from '@/components/Button';
import { Container, Wrapper } from '@/components/Layout';
import { useEffect, useState } from 'react';
// import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const arrayHighlightedText = [
    'Absensi',
    'Pengajuan Cuti',
    'Pengajuan Izin',
    'Reimbursement',
  ];
  const [stateHighlight, setStateHighlight] = useState(arrayHighlightedText[1]);
  const [numberHighlighted, setNumberHighlighted] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      //assign interval to a variable to clear it.
      setStateHighlight(arrayHighlightedText[numberHighlighted]);
      if (numberHighlighted === arrayHighlightedText.length - 1) {
        setNumberHighlighted(0);
      } else {
        setNumberHighlighted((state) => state + 1);
      }
    }, 800);
    return () => clearInterval(intervalId); //This is important
  }, [stateHighlight, numberHighlighted, arrayHighlightedText]);
  return (
    <Wrapper>
      <div>
        <h1 className={styles.title}>
          <span className={styles.nextjs}>Kantoranku</span>
        </h1>
        <h2 className={styles.highlight}>
          <span className={styles.textHighlight}>
            Lakukan " {stateHighlight} " kantormu disini.
          </span>
        </h2>
        <Container justifyContent="center" className={styles.buttons}>
          {/* <Container>
            <Link passHref href="/feed">
              <ButtonLink className={styles.button}>Explore Feed</ButtonLink>
            </Link>
          </Container>
          <Spacer axis="horizontal" size={1} />
          <Container>
            <ButtonLink
              href="https://github.com/rizk19"
              type="secondary"
              className={styles.button}
            >
              GitHub
            </ButtonLink>
          </Container> */}
        </Container>
        <p className={styles.subtitle}>
          Kantoranku akan membantu perusahaanmu mengelola keperluan karyawanmu
          dengan mudah dan simple.
        </p>
      </div>
    </Wrapper>
  );
};

export default Hero;
