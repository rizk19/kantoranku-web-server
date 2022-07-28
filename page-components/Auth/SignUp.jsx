import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import { TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

const SignUp = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const companyEmailRef = useRef();
  const companyNameRef = useRef();

  const { mutate } = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        await fetch('/api/company', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: companyEmailRef.current.value,
            name: companyNameRef.current.value,
          }),
        }).then(async (res) => {
          let payload;
          try {
            if (res.status === 204) return null; // 204 does not have body
            payload = await res.json();
          } catch (e) {
            /* noop */
          }
          if (res.ok) {
            const responseUser = await fetcher('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: emailRef.current.value,
                name: '',
                password: passwordRef.current.value,
                username: usernameRef.current.value,
                companyId: payload.company._id,
                role: 'admin',
              }),
            });
            mutate(
              {
                user: responseUser.user,
                companyEmail: payload.company.email,
                companyId: payload.company._id,
              },
              false
            );
            toast.success('Your account has been created');
            router.replace('/feed');
          } else {
            return Promise.reject(
              payload.error || new Error('Something went wrong')
            );
          }
        });
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, router]
  );

  return (
    <Wrapper className={styles.root}>
      <div className={styles.main}>
        <h1 className={styles.title}>Join Now</h1>
        <form onSubmit={onSubmit}>
          <Container alignItems="center">
            <p className={styles.subtitle}>register company</p>
            <div className={styles.seperator} />
          </Container>
          <Input
            ref={companyEmailRef}
            htmlType="email"
            autoComplete="email"
            placeholder="Company Email"
            ariaLabel="Company Email"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Input
            ref={companyNameRef}
            autoComplete="name"
            placeholder="Company name"
            ariaLabel="Company name"
            size="large"
            required
          />
          <Spacer size={0.75} axis="vertical" />
          <Container alignItems="center">
            <p className={styles.subtitle}>Your admin login</p>
            <div className={styles.seperator} />
          </Container>
          <Input
            ref={emailRef}
            htmlType="email"
            autoComplete="email"
            placeholder="Email Address"
            ariaLabel="Email Address"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Input
            ref={usernameRef}
            autoComplete="username"
            placeholder="Username"
            ariaLabel="Username"
            size="large"
            required
          />
          <Spacer size={0.5} axis="vertical" />
          <Input
            ref={passwordRef}
            htmlType="password"
            autoComplete="new-password"
            placeholder="Password"
            ariaLabel="Password"
            size="large"
            required
          />
          <Spacer size={1} axis="vertical" />
          <Button
            htmlType="submit"
            className={styles.submit}
            type="success"
            size="large"
            loading={isLoading}
          >
            Sign up
          </Button>
        </form>
      </div>
      <div className={styles.footer}>
        <Link href="/login" passHref>
          <TextLink color="link" variant="highlight">
            Already have an account? Log in
          </TextLink>
        </Link>
      </div>
    </Wrapper>
  );
};

export default SignUp;
